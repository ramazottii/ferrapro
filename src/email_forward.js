export default {
  async email(message) {
    await message.forward("ramazanunver2012@gmail.com");
    await message.forward("ayfercelebib@hotmail.com");
  },
};
