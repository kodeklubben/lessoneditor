const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const client = new SecretManagerServiceClient();

module.exports = async (name) => {
  const [accessResponse] = await client.accessSecretVersion({
    name: name,
  });
  const responsePayload = accessResponse.payload.data.toString("utf8");
  return JSON.parse(responsePayload);
};
