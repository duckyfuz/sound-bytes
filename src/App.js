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
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Predictions } from 'aws-amplify';
import { fetchNews } from './helper/news';
import { generateScript } from './helper/openAI';

function App() {
  let [newsObject, setNewsObject] = React.useState({});
  let [activeCategory, setActiveCategory] = React.useState('singapore');
  let [selectedNews, setSelectedNews] = React.useState([]);

  let [value, setValue] = React.useState();
  let [speakerDict, setSpeakerDict] = React.useState({});
  let [audio, setAudio] = React.useState();

  let [loading, setLoading] = React.useState(true);

  useEffect(() => {
    (async () => {
      const tempNewsObject = await fetchNews();
      setNewsObject(tempNewsObject);
    })();
    setLoading(false);
  }, []);

  const createHandler = async () => {
    setLoading(true);
    const script = await generateScript(selectedNews);
    let value = script.split('\n');
    value = value.filter(str => str !== '');
    value = value.map(el => {
      return el.replace('Emma:', '').replace('William:', '');
    });
    setValue(value);
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
    for (let i = 0; i < value.length; i++) {
      let speaker = i % 2 === 0 ? 'Amy' : 'Russell';
      await processTextToSpeech(value[i], speaker, i);
    }
    setLoading(false);
  };

  const combineHandler = () => {
    console.log(speakerDict);
    let speakerArray = [];
    for (let i = 0; i < Object.keys(speakerDict).length; i++) {
      speakerArray.push(speakerDict[i]);
    }
    console.log(speakerArray);
    let uris = speakerArray,
      proms = uris.map(uri => fetch(uri).then(r => r.blob()));
    Promise.all(proms).then(blobs => {
      let blob = new Blob(blobs),
        blobUrl = URL.createObjectURL(blob);
      setAudio(blobUrl);
    });
  };

  return (
    <ChakraProvider theme={theme}>
      <Grid minH="50vh" gap={1}>
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
                    colorScheme={activeCategory === category ? 'teal' : 'gray'}
                  >
                    {category}
                  </Button>
                ))}
              </HStack>
              <VStack>
                {newsObject[activeCategory]?.map(news => (
                  <Checkbox
                    key={news.publishedAt}
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
        </VStack>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
