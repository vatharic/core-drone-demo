export default {
  types: ['Global'],
  init(args) {
    const { api, config } = args;
    const appID = /[^/]*$/.exec(config.url)[0];
    api.appID = appID;
  },
  extend: {
    async getDoc() {
      const doc = await this.openDoc(this.appID);
      return doc;
    },
  },
};
