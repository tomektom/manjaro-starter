#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use sysinfo::{NetworkExt, NetworksExt, ProcessExt, System, SystemExt};
use std::process::Command;
use serde_json::json;

#[tauri::command]
fn run_shell_command(command: String) -> String {
  let output= Command::new("sh")
            .arg("-c")
            .arg(command)
            .output()
            .unwrap();
  return format!("{:?}",output.status.success());
}
#[tauri::command]
fn run_shell_command_with_result(command: String) -> String {
  let output= Command::new("sh")
            .arg("-c")
            .arg(command)
            .output()
            .unwrap();
  return format!("{:?}",String::from_utf8_lossy(&output.stdout));
}
#[tauri::command]
fn get_sys_info() -> String {
  let mut sys = System::new_all();

  // First we update all information of our `System` struct.
  sys.refresh_all();
  let sys_info = json!( {
    "total_memory": sys.total_memory().to_string(),
    "used_memory": sys.used_memory().to_string(),
    "total_swap": sys.total_swap().to_string(), 
    "used_swap": sys.used_swap().to_string(),
    "sys_name":sys.name(),
    "sys_kernel_version":sys.kernel_version(),
    "sys_os_version":sys.os_version(),
    "sys_host_name":sys.host_name(),
    "number_of_cpu":sys.cpus().len().to_string()
  });
  return sys_info.to_string();
}
fn main() {
  tauri::Builder::default()
  // This is where you pass in your commands
  .invoke_handler(tauri::generate_handler![run_shell_command,run_shell_command_with_result,get_sys_info])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
