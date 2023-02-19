module.exports = {
  config: () => {
    console.log("config");

    return {
      status: 200,
      message: "done",
    };
  },
};
