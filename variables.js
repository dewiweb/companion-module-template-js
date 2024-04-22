module.exports = async function (self) {
  self.setVariableDefinitions([
    { name: "Last TCP Response", variableId: "tcp_response" },
    { variableId: "variable1", name: "My first variable" },
    { variableId: "variable2", name: "My second variable" },
    { variableId: "variable3", name: "Another variable" },
  ]);
};
