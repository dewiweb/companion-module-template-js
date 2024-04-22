const {
  InstanceBase,
  Regex,
  runEntrypoint,
  InstanceStatus,
  TCPHelper,
} = require("@companion-module/base");
const UpgradeScripts = require("./upgrades");
const UpdateActions = require("./actions");
const UpdateFeedbacks = require("./feedbacks");
const UpdateVariableDefinitions = require("./variables");

class GenericTcpUdpInstance extends InstanceBase {
  constructor(internal) {
    super(internal);
  }

  async init(config) {
    this.config = config;

    this.updateStatus(InstanceStatus.Ok);

    this.updateActions(); // export actions
    this.updateFeedbacks(); // export feedbacks
    this.updateVariableDefinitions(); // export variable definitions
  }
  // When module gets deleted
  async destroy() {
    this.log("debug", "destroy");
  }

  async configUpdated(config) {
    if (this.socket) {
      this.socket.destroy();
      delete this.socket;
    }
    this.config = config;

    this.init_tcp();

    this.init_tcp_variables();
  }

  // Return config fields for web config
  getConfigFields() {
    return [
      {
        type: "static-text",
        id: "info",
        label: "Information",
        width: 12,
        value: `
				<div class="alert alert-danger">
					<h3>IMPORTANT MESSAGE</h3>
					<div>
					</div>
				</div>
			`,
      },
      {
        type: "textinput",
        id: "host",
        label: "Target IP",
        width: 8,
        regex: Regex.IP,
      },
      {
        type: "textinput",
        id: "port",
        label: "Target Port",
        width: 4,
        default: 7000,
        regex: Regex.PORT,
      },
    ];
  }

  init_tcp() {
    if (this.socket) {
      this.socket.destroy();
      delete this.socket;
    }

    this.updateStatus(InstanceStatus.Connecting);

    if (this.config.host) {
      this.socket = new TCPHelper(this.config.host, this.config.port);

      this.socket.on("status_change", (status, message) => {
        this.updateStatus(status, message);
      });

      this.socket.on("error", (err) => {
        this.updateStatus(InstanceStatus.ConnectionFailure, err.message);
        this.log("error", "Network error: " + err.message);
      });

      this.socket.on("data", (data) => {
        let dataResponse = data.toString();
        this.log(
          "debug",
          "received from " + this.config.host + " = " + dataResponse
        );
        if (dataResponse.includes("test.pattern")) {
          this.setVariableValues({ variable2: dataResponse });
        }
        this.setVariableValues({ tcp_response: dataResponse });
      });
    } else {
      this.updateStatus(InstanceStatus.BadConfig);
    }
  }

  updateActions() {
    UpdateActions(this);
  }

  updateFeedbacks() {
    UpdateFeedbacks(this);
  }

  updateVariableDefinitions() {
    UpdateVariableDefinitions(this);
  }
}

runEntrypoint(GenericTcpUdpInstance, UpgradeScripts);
