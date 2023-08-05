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
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Predictions } from 'aws-amplify';

function App() {
  let [value, setValue] = React.useState('');
  let [soundByte, setSoundByte] = React.useState();

  let handleInputChange = e => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };

  const toast = useToast();

  const createHandler = () => {
    // toast({
    //   title: 'Account created.',
    //   description: "We've created your account for you.",
    //   status: 'success',
    //   duration: 9000,
    //   isClosable: true,
    // });
    Predictions.convert({
      textToSpeech: {
        source: {
          text: value,
        },
        voiceId: 'Russell', // default configured on aws-exports.js
        // list of different options are here https://docs.aws.amazon.com/polly/latest/dg/voicelist.html
      },
    })
      .then(result => {
        setSoundByte(result);
        console.log(result['speech']['url']);
      })
      .catch(err => console.log({ err }));
  };

  // const playHandler = () => {
  //   let AudioContext = window.AudioContext || window.webkitAudioContext;
  //   console.log({ AudioContext });
  //   const audioCtx = new AudioContext();
  //   const source = audioCtx.createBufferSource();
  //   audioCtx.decodeAudioData(
  //     soundByte.audioStream,
  //     buffer => {
  //       source.buffer = buffer;
  //       source.connect(audioCtx.destination);
  //       source.start(0);
  //     },
  //     err => console.log({ err })
  //   );
  // };

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
            {/* <Button colorScheme="teal" size="lg" onClick={playHandler}>
              Play
            </Button> */}
            {soundByte && (
              <Link href={soundByte['speech']['url']} isExternal>
                Listen to soundByte
              </Link>
            )}
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
