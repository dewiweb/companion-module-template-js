module.exports = function (self) {
  self.setActionDefinitions({
    send: {
      name: "Send Command",
      options: [
        {
          type: "textinput",
          id: "id_send",
          label: "Command:",
          tooltip: "Use %hh to insert Hex codes",
          default: "",
          useVariables: true,
        },
        //        {
        //          type: "dropdown",
        //          id: "id_end",
        //          label: "Command End Character:",
        //          default: "\n",
        //          choices: CHOICES_END,
        //        },
      ],
      callback: async (action) => {
        const cmd = unescape(
          await self.parseVariablesInString(action.options.id_send)
        );

        if (cmd != "") {
          /*
           * create a binary buffer pre-encoded 'latin1' (8bit no change bytes)
           * sending a string assumes 'utf8' encoding
           * which then escapes character values over 0x7F
           * and destroys the 'binary' content
           */
          //			const sendBuf = Buffer.from(cmd + action.options.id_end, "latin1");
          const sendBuf = Buffer.from(cmd + "\r", "latin1");

          self.log(
            "debug",
            "sending to " + self.config.host + ": " + sendBuf.toString()
          );

          if (self.socket !== undefined && self.socket.isConnected) {
            self.socket.send(sendBuf);
          } else {
            self.log("debug", "Socket not connected :(");
          }
        }
      },
    },
    testPatterns: {
      name: "TestPatterns",
      options: [
        {
          id: "val",
          type: "dropdown",
          label: "Select name",
          choices: [
            { id: 0, label: "Off" },
            { id: 1, label: "White" },
            { id: 2, label: "Black" },
            { id: 3, label: "Red" },
            { id: 4, label: "Green" },
            { id: 5, label: "Blue" },
            { id: 6, label: "Checkboard" },
            { id: 7, label: "CrossHatch" },
            { id: 8, label: "V Burst" },
            { id: 9, label: "H Burst" },
            { id: 10, label: "ColorBar" },
            { id: 11, label: "Plunge" },
          ],
          default: 0,
          useVariables: true,
        },
        //        {
        //          type: "dropdown",
        //          id: "id_end",
        //          label: "Command End Character:",
        //          default: "\n",
        //          choices: CHOICES_END,
        //        },
      ],
      callback: async (action) => {
        const pattern = await self.parseVariablesInString(action.options.val);
        self.log("debug", "pattern = " + pattern);
        if (pattern != "") {
          if (self.socket !== undefined && self.socket.isConnected) {
            self.log(
              "debug",
              "sending to " + self.config.host + ":  *test.pattern = " + pattern
            );
            self.socket.send(
              Buffer.from("*test.pattern = " + pattern + "\r", "latin1")
            );
          } else {
            self.log("debug", "Socket not connected :(");
          }
        }
      },
    },
    lensAdjustments: {
      name: "lensAdjustments",
      options: [
        {
          id: "adjustment",
          type: "dropdown",
          label: "Select name",
          choices: [
            { id: "zoom.in", label: "zoom in" },
            { id: "zoom.out", label: "zoom out" },
            { id: "focus.near", label: "focus near" },
            { id: "focus.far", label: "focus far" },
            { id: "lens.up", label: "lens up" },
            { id: "lens.down", label: "lens down" },
            { id: "lens.left", label: "lens left" },
            { id: "lens.right", label: "lens right" },
            { id: "lens.center", label: "lens center" },
          ],
          default: 0,
          useVariables: true,
        },
        //        {
        //          type: "dropdown",
        //          id: "id_end",
        //          label: "Command End Character:",
        //          default: "\n",
        //          choices: CHOICES_END,
        //        },
      ],
      callback: async (action) => {
        const adjustment = await self.parseVariablesInString(
          action.options.adjustment
        );
        if (adjustment != "") {
          if (self.socket !== undefined && self.socket.isConnected) {
            self.log(
              "debug",
              "sending to " + self.config.host + ":  *" + adjustment
            );
            self.socket.send(Buffer.from("*" + adjustment + "\r", "latin1"));
          } else {
            self.log("debug", "Socket not connected :(");
          }
        }
      },
    },
    configUpdated: {
      name: "Config Updated",
      options: [],
      callback: async () => {
        await self.configUpdated();
      },
    },
  });
};
