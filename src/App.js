import React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  theme,
  Button,
  Textarea,
  useToast,
  Link,
  Text,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Predictions } from 'aws-amplify';

function App() {
  let [value, setValue] = React.useState();
  let [soundByte, setSoundByte] = React.useState();
  let [speakerDict, setSpeakerDict] = React.useState({});
  let [audio, setAudio] = React.useState();

  let handleInputChange = e => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

  const toast = useToast();

  const createHandler = () => {
    const tempValue = [
      "Emma: Welcome back to Daily Chatter, your go-to podcast for the latest news stories. I'm your host, Emma, and joining me today is my co-host, William.",
      "William: Thanks, Emma. I'm excited to discuss today's news with you. Let's jump right in.",
      "Emma: Absolutely. Our first story is about George Goh, the founder of Harvey Norman Ossia, who has submitted his application for a certificate of eligibility to contest the upcoming Presidential Election in Singapore. He mentioned that he is a 'serious candidate' and pointed out that his group of five companies has a combined shareholders' equity of over S$1.5 billion in the past three years.",
      "William: Yes, that's quite a substantial amount. Mr. Goh did not disclose the names of the companies, but he stated that all five of them have been profitable every year for the last three years. It's interesting to note that this is the first time he has mentioned these companies. Previously, he had stated that his companies have a “collective market capitalisation value of S$3.15 billion”.",
      "Emma: Right, William. Mr. Goh made it clear that he has planned for this day since 2017, when he first heard about the changes to the eligibility criteria for private sector candidates. He mentioned that the requirements are very stringent and very few people can qualify. Under the new criteria, candidates must have served as the CEO of one company, or be the most senior executive running the firm, for at least three years. The company must also have at least S$500 million in shareholders' equity during the person's most recent three-year period as CEO, and have been profitable after tax for the entire time.",
      "William: Mr. Goh also broke down the numbers for the combined profits after tax from the five companies over the past three years – S$377 million. The total shareholders' equity for these companies for the past three years is S$1.521 billion, with an average yearly shareholders' equity of S$507 million. He mentioned that he is the most senior executive in each of these companies.",
      'Emma: Yes, and when asked about why he did not disclose the names of the five companies, Mr. Goh said that fake news is rampant and he does not want his companies to face any unnecessary pressure. He wants to be a responsible CEO.',
      "William: It's clear that Mr. Goh is confident he meets the eligibility criteria and is well-prepared for this day. It will be interesting to see how his candidacy progresses in the coming months.",
      'Emma: Definitely. Moving on to our next story, the husband of late Hong Kong pop diva Coco Lee, Bruce Rockowitz, has spoken out after being confronted by fans at her cremation service. Fans accused him of being responsible for her depression and death, but Mr. Rockowitz denied these allegations, stating that he had nothing to do with her decision to end her life.',
      'William: That must have been an incredibly difficult situation for Mr. Rockowitz. He mentioned that he has nothing to do with her death and that their relationship, although not 100% perfect like any other, lasted for 20 years.',
      'Emma: Right, William. Mr. Rockowitz is a businessman who arrived in Hong Kong in the late 1970s. He dismissed the claims made by fans at the cremation service and emphasized that he does not understand Chinese very well, so he was unable to comprehend what was said.',
      "William: It's understandable that emotions were running high at the funeral, but it's important to remember that everyone is going through their own grief and it's not fair to place blame without concrete evidence.",
      "Emma: Absolutely, William. It's a tragic situation all around, and we hope that both Mr. Rockowitz and Coco Lee's family find peace and healing in the days to come.",
      'William: That wraps up our news stories for today. Thank you, Emma, for discussing these topics with me.',
      "Emma: Thank you, William. It was a pleasure as always. And thank you to all our listeners for tuning in to Daily Chatter. We'll be back tomorrow with more news stories. Stay informed and have a great day!",
    ];

    const processTextToSpeech = async (text, speaker, i) => {
      try {
        const result = await Predictions.convert({
          textToSpeech: {
            source: { text },
          },
          voiceId: speaker,
        });

        // Update the state with the new URL
        setSpeakerDict(prevState => ({
          ...prevState,
          [i]: result['speech']['url'],
        }));
      } catch (err) {
        console.log(err);
      }
    };

    for (let i = 0; i < tempValue.length; i++) {
      let speaker = i % 2 === 0 ? 'Amy' : 'Russell';
      processTextToSpeech(tempValue[i], speaker, i);
    }
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
        blobUrl = URL.createObjectURL(blob),
        audio = new Audio(blobUrl);
      // console.log(blobUrl);
      // console.log(audio);
      setAudio(blobUrl);
      // audio.play();
    });
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Textarea
              width={(window.innerWidth * 2) / 3}
              value={value}
              onChange={handleInputChange}
              placeholder="Here is a sample placeholder"
              size="sm"
              resize={'vertical'}
            />
            <Button colorScheme="teal" size="lg" onClick={createHandler}>
              Create soundByte
            </Button>
            <Button colorScheme="teal" size="lg" onClick={combineHandler}>
              Combine
            </Button>
            {soundByte && (
              <>
                <Link
                  href={soundByte['speech']['url']}
                  download="filename.mp3"
                  isExternal
                >
                  Download soundByte
                </Link>
                <Link
                  href={soundByte['speech']['url']}
                  // download="filename.mp3"
                  isExternal
                >
                  Listen in Browser
                </Link>
              </>
            )}
            <audio controls src={audio}>
              <a href={audio}> Download audio </a>
            </audio>
            <Text>{audio && audio}</Text>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
