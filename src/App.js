import React, { useEffect } from 'react';
import {
  ChakraProvider,
  HStack,
  VStack,
  Grid,
  theme,
  Button,
  Link,
  Checkbox,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  TabList,
  Textarea,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Predictions } from 'aws-amplify';
import { fetchNews } from './helper/news';
import { generateCustom, generateScript } from './helper/openAI';

// add feature convert own article

function App() {
  const [tabIndex, setTabIndex] = React.useState(0);

  let [newsObject, setNewsObject] = React.useState({});
  let [activeCategory, setActiveCategory] = React.useState('singapore');
  let [selectedNews, setSelectedNews] = React.useState([]);

  let [speakerDict, setSpeakerDict] = React.useState({});
  let [audio, setAudio] = React.useState();

  let [loading, setLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      const tempNewsObject = await fetchNews();
      setNewsObject(tempNewsObject);
    })();
    setLoading(false);
    // (async function () {
    //   fetch('/')
    //     .then(res => res.text())
    //     .then(html => console.log(html));
    // })();
  }, []);

  const createHandler = async () => {
    const processTextToSpeech = async (text, speaker, i) => {
      try {
        const result = await Predictions.convert({
          textToSpeech: {
            source: { text },
            voiceId: speaker,
          },
        });
        setSpeakerDict(prevState => ({
          ...prevState,
          [i]: result['speech']['url'],
        }));
      } catch (err) {
        console.log(err);
      }
    };

    setLoading(true);

    if (tabIndex === 0) {
      console.log('Generating from NEWS');
      const script = await generateScript(selectedNews);
      let value = script.split('\n');
      value = value.filter(str => str !== '');
      value = value.map(el => {
        return el.replace('Emma:', '').replace('William:', '');
      });
      for (let i = 0; i < value.length; i++) {
        let speaker = i % 2 === 0 ? 'Ivy' : 'Justin';
        await processTextToSpeech(value[i], speaker, i);
      }
      setLoading(false);
    } else {
      console.log('Generating from CUSTOM');
      const script = await generateCustom(custom);
      console.log(script);
      let value = script.split('\n');
      value = value.filter(str => str !== '');
      value = value.map(el => {
        return el.replace('Emma:', '').replace('William:', '');
      });
      for (let i = 0; i < value.length; i++) {
        let speaker = i % 2 === 0 ? 'Amy' : 'Russell';
        await processTextToSpeech(value[i], speaker, i);
      }
      setLoading(false);
    }
  };

  const combineHandler = () => {
    // console.log(speakerDict);
    let speakerArray = [];
    for (let i = 0; i < Object.keys(speakerDict).length; i++) {
      speakerArray.push(speakerDict[i]);
    }
    // console.log(speakerArray);
    let uris = speakerArray,
      proms = uris.map(uri => fetch(uri).then(r => r.blob()));
    Promise.all(proms).then(blobs => {
      let blob = new Blob(blobs),
        blobUrl = URL.createObjectURL(blob);
      setAudio(blobUrl);
    });
  };

  let [custom, setCustom] = React.useState('');

  let handleInputChange = e => {
    let inputValue = e.target.value;
    setCustom(inputValue);
  };

  return (
    <ChakraProvider theme={theme}>
      <Grid gap={1}>
        <ColorModeSwitcher justifySelf="flex-end" />

        <VStack spacing={8}>
          <HStack gap={6}>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={createHandler}
              isLoading={loading}
            >
              Create soundBytes
            </Button>
            {Object.keys(speakerDict).length !== 0 && (
              <Button colorScheme="teal" size="lg" onClick={combineHandler}>
                Combine soundBytes
              </Button>
            )}
          </HStack>
          {audio && (
            <VStack>
              <audio controls src={audio}>
                <a href={audio}> Download audio </a>
              </audio>
              <Link href={audio} download="soundByte.mp3" isExternal>
                Download soundByte
              </Link>
            </VStack>
          )}
          {/* <Text>{audio && audio}</Text> */}
          {/* <Text>{value && value}</Text> */}

          <Tabs
            isFitted
            align="center"
            size="lg"
            variant="enclosed"
            colorScheme="teal"
            width={900}
            onChange={index => setTabIndex(index)}
          >
            <TabList>
              <Tab>News API</Tab>
              <Tab>Custom Article</Tab>
            </TabList>
            {/* <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="teal"
              borderRadius="1px"
            /> */}
            <TabPanels>
              <TabPanel>
                {newsObject !== {} && (
                  <VStack spacing={4}>
                    <HStack>
                      {[
                        'singapore',
                        'business',
                        'entertainment',
                        'general',
                        'health',
                        'science',
                        'sports',
                        'technology',
                      ].map(category => (
                        <Button
                          onClick={() => {
                            setActiveCategory(category);
                          }}
                          key={category}
                          colorScheme={
                            activeCategory === category ? 'teal' : 'gray'
                          }
                        >
                          {category}
                        </Button>
                      ))}
                    </HStack>
                    <VStack>
                      {newsObject[activeCategory]?.map(news => (
                        <Checkbox
                          key={news.title}
                          onChange={() => {
                            setSelectedNews([...selectedNews, news]);
                          }}
                        >
                          {news.author} | {news.title}
                        </Checkbox>
                      ))}
                    </VStack>
                  </VStack>
                )}
              </TabPanel>
              <TabPanel>
                <Textarea
                  value={custom}
                  onChange={handleInputChange}
                  placeholder="Start writing!"
                  size="lg"
                  h={500}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
