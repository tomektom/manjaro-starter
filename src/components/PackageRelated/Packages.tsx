import {
  Box,
  Center,
  Button,
  SimpleGrid,
  useColorModeValue,
  chakra,
  Wrap,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import {
  packageState,
  Category,
  Package,
} from '../../stores/PackageStore';
import PackageDetail from './PackageDetail';

const PackagesList: React.FC = () => {
  const packageSt = useRecoilValue(packageState);
  const { t } = useTranslation();
  const [sliderRef, instanceRef] = useKeenSlider({
    mode: 'free-snap',
    loop: true,
    slides: {
      origin: 'center',
      perView: 3,
      spacing: 15,
    },
  }, [
    (slider) => {
      let timeout: ReturnType<typeof setTimeout>;
      let mouseOver = false;
      function clearNextTimeout() {
        clearTimeout(timeout);
      }
      function nextTimeout() {
        clearTimeout(timeout);
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 2000);
      }
      slider.on('created', () => {
        slider.container.addEventListener('mouseover', () => {
          mouseOver = true;
          clearNextTimeout();
        });
        slider.container.addEventListener('mouseout', () => {
          mouseOver = false;
          nextTimeout();
        });
        nextTimeout();
      });
      slider.on('dragStarted', clearNextTimeout);
      slider.on('animationEnded', nextTimeout);
      slider.on('updated', nextTimeout);
    },
  ]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const Categories = (
    <Wrap mt={8} justify="center">
      {Array.from(packageSt.values()).map((category:Category) => (
        <Button onClick={() => {
          const anchor = document.querySelector(`#${category.name.replaceAll(' ', '-').replaceAll('/', '-')}`);
          anchor?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }}
        >
          {category.name}

        </Button>
      ))}
    </Wrap>
  );
  const Apps = Array.from(packageSt.values()).map((category:Category) => (
    <Box mt={8} key={category.id}>
      <Box textAlign={{ lg: 'left' }}>
        <chakra.p
          mt={2}
          fontSize={{ base: '3xl', sm: '4xl' }}
          lineHeight="8"
          fontWeight="extrabold"
          letterSpacing="tight"
          id={category.name.replaceAll(' ', '-').replaceAll('/', '-')}
          color="white.900"
          _dark={{ color: 'white.100' }}
        >
          {category.name}
        </chakra.p>
        <chakra.p
          mt={4}
          maxW="2xl"
          fontSize="xl"
          color="gray.500"
          _dark={{ color: 'gray.400' }}
        >
          {category.description}
        </chakra.p>
        <SimpleGrid
          spacingX={{ base: 16, lg: 24 }}
          spacingY={10}
          mt={6}
        >
          <div ref={sliderRef} className="keen-slider">
            {Array.from(category.packages.values()).map((app:Package) => (
              <div className="keen-slider__slide">
                <PackageDetail
                  title={app.name}
                  pkg={app.pkg}
                  key={app.id}
                  uniqueId={app.id}
                  isInstalled={app.isInstalled}
                  catId={category.id}
                  installedVersion={app.installedVersion}
                  icon={app.icon}
                >
                  {app.description}
                </PackageDetail>
              </div>
            ))}
          </div>

        </SimpleGrid>
      </Box>

    </Box>
  ));
  return (
    <Box
      px={8}
      py={20}
      mx="auto"
      bg={useColorModeValue('white', 'gray.800')}
    >
      <Box textAlign={{ lg: 'center' }}>
        <chakra.p
          mt={2}
          fontSize={{ base: '3xl', sm: '4xl' }}
          lineHeight="8"
          fontWeight="extrabold"
          letterSpacing="tight"
          color={useColorModeValue('white.900', 'white.100')}
        >
          {t('packages')}
        </chakra.p>

        <chakra.p
          mt={4}
          maxW="2xl"
          fontSize="xl"
          mx={{ lg: 'auto' }}
          color={useColorModeValue('gray.500', 'gray.400')}
        >
          {t('installPackagesText')}
        </chakra.p>
      </Box>
      {Categories}
      { Apps}

      <Center>
        <a href="https://software.manjaro.org/applications" target="_blank" rel="noreferrer">
          <Button
            mt={10}
            size="md"
            height="48px"
            width="200px"
            border="2px"
            borderColor="green.500"
          >
            {t('discoverMore')}
          </Button>
        </a>
      </Center>
    </Box>
  );
};
export default PackagesList;
