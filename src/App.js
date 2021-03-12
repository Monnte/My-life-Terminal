import "./App.css";
import React, { useRef } from "react";

function App() {
  const cmd = useRef(null);
  const window = useRef(null);

  function handleFocus() {
    cmd.current.focus();
  }

  return (
    <div className="app" onClick={handleFocus}>
      <div className="window" ref={window}>
        <div className="titlebar">
          <div className="buttons">
            <div className="close"></div>
            <div className="minimize"></div>
            <div className="zoom"></div>
          </div>
        </div>
        <Terminal cmdref={cmd} windowref={window} focus={handleFocus} />
      </div>
    </div>
  );
}

export default App;

class Terminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commands: [],
      commandList: {},
      lineStyle: { width: "10%" },
      maxLengthContent: 10,
    };
    this.doCommand = this.doCommand.bind(this);
    this.showCommands = this.showCommands.bind(this);
    this.fetchCommands = this.fetchCommands.bind(this);
    this.contentRef = React.createRef();
    this.pathRef = React.createRef();
  }

  componentDidMount() {
    this.fetchCommands();
    this.setState({
      commands: ["Type 'help'"],
    });
    console.log(this.pathRef.current.offsetWidth);
    console.log(this.pathRef.current.offsetWidth);

    var maxCommandWidth =
      this.contentRef.current.offsetWidth - this.pathRef.current.offsetWidth;
    this.setState({
      lineStyle: {
        width: maxCommandWidth * 0.9 + "px",
      },
      maxLengthContent: maxCommandWidth / 10,
    });
    console.log();
  }

  fetchCommands() {
    fetch("commands.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then((json) => {
        this.setState({ commandList: json });
      });
  }

  doCommand(command) {
    command = command.trim();
    var response = "";

    // CLEAR METHOD
    if (command === "clear") {
      this.setState({ commands: [] });
      return;
    }

    if (command in this.state.commandList)
      response = this.state.commandList[command].response;
    else response = command + ": command not found";

    this.setState({
      commands: [
        ...this.state.commands,
        <Command command={command} response={response} />,
      ],
    });
  }

  showCommands() {
    var id = 0;
    return this.state.commands.map((command) => (
      <div key={id++}>{command}</div>
    ));
  }

  render() {
    return (
      <div className="content" id="cmdContent" ref={this.contentRef}>
        {this.showCommands()}

        {/* Command line */}
        <span className="line-part1" ref={this.pathRef}>
          root@user<span className="line-part2">/dev/null$ </span>
        </span>

        <Input
          anchor={this.props.cmdref}
          submit={this.doCommand}
          style={this.state.lineStyle}
          maxLengthContent={this.state.maxLengthContent}
        />
        <br />
      </div>
    );
  }
}

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    if (event.target.value.length < this.props.maxLengthContent)
      this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.submit(this.state.value);
    this.setState({ value: "" });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} id="cmdForm" style={this.props.style}>
        <input
          id="cmd"
          ref={this.props.anchor}
          value={this.state.value}
          onChange={this.handleChange}
          autoFocus
          contentEditable
        ></input>
      </form>
    );
  }
}

class Command extends React.Component {
  constructor(props) {
    super(props);
    this.anchor = React.createRef();
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }

  scrollToBottom() {
    this.anchor.current.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <div className="command">
        <span className="line-part1">root@user</span>
        <span className="line-part2">/dev/null$ </span>
        <span>{this.props.command}</span>
        <br />
        <div dangerouslySetInnerHTML={{ __html: this.props.response }} />
        <div ref={this.anchor} />
      </div>
    );
  }
}
