// import sampleNews from './sampleNews.json';
const { Configuration, OpenAIApi } = require('openai');

export const generateScript = async selectedNews => {
  let newsString = '';
  // for (let i = 0; i < sampleNews.length; i++) {
  //   newsString += `Author: ${sampleNews[i]["author"]} \n Title: ${sampleNews[i]["title"]} \n Content: ${sampleNews[i]["content"]} \n`;
  // }
  for (let i = 0; i < selectedNews.length; i++) {
    newsString += `Author: ${selectedNews[i]['author']} \n Title: ${selectedNews[i]['title']} \n Content: ${selectedNews[i]['content']} \n`;
  }
  const prompt = `Generate a script for a podcast named soundByte discussing the daily news between Ammy, and her co-host, Russell.
    Emma should be the first one to speak.
    Keep it lighthearted. 
    Besides the information provided, you can supplement with your own knowledge. 
    The relevant daily news of today would be:\n${newsString}`;
  console.log(prompt);

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.6,
    max_tokens: 1000,
  });
  const result = response.data.choices[0].text;

  // const response = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo", // https://platform.openai.com/docs/models/gpt-3-5
  //   messages: [
  //     {
  //       role: "system",
  //       content: prompt,
  //     },
  //   ],
  // });
  // const result = response.data.choices[0].message;

  // console.log(result);
  return result;
};

export const generateCustom = async article => {
  // let newsString = '';
  // // for (let i = 0; i < sampleNews.length; i++) {
  // //   newsString += `Author: ${sampleNews[i]["author"]} \n Title: ${sampleNews[i]["title"]} \n Content: ${sampleNews[i]["content"]} \n`;
  // // }
  // for (let i = 0; i < selectedNews.length; i++) {
  //   newsString += `Author: ${selectedNews[i]['author']} \n Title: ${selectedNews[i]['title']} \n Content: ${selectedNews[i]['content']} \n`;
  // }
  const prompt = `Generate a script for a podcast named soundByte discussing the article between Emma, and her co-host, William.
    Emma should be the first one to speak.
    Keep it lighthearted. 
    Besides the information provided, you can supplement with your own knowledge. 
    The relevant article is as follows:\n${article}`;
  console.log(prompt);

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.6,
    max_tokens: 1000,
  });
  const result = response.data.choices[0].text;

  return result;
};
