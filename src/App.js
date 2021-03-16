import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import defaultCommandList from "./commands";

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

function Terminal(props) {
  const contentRef = useRef(null);
  const pathRef = useRef(null);

  const [commands, setCommands] = useState([]);
  const [commandList] = useState(defaultCommandList);

  function doCommand(command) {
    command = command.trim();
    var response = "";

    if (command === "clear") {
      setCommands([]);
      return;
    }

    if (command in commandList) response = commandList[command].response;
    else response = command + ": command not found -- type 'help'";

    setCommands([
      ...commands,
      <Command command={command} response={response} />,
    ]);
  }

  function showCommands() {
    return commands.map((command, index) => <div key={index++}>{command}</div>);
  }

  return (
    <div className="content" id="cmdContent" ref={contentRef}>
      {showCommands()}

      {/* Command line */}
      <span className="line-part1" ref={pathRef}>
        root@user<span className="line-part2">/dev/null$ </span>
      </span>

      <Input anchor={props.cmdref} submit={doCommand} />
      <br />
    </div>
  );
}

function Input(props) {
  const [value, setValue] = useState("");
  const myFormRef = useRef(null);

  function handleChange(event) {
    setValue(event.target.value);
  }

  function onEnterPress(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      props.submit(value);
      setValue("");
    }
  }

  return (
    <form ref={myFormRef} id="cmdForm">
      <textarea
        rows="1"
        id="cmd"
        ref={props.anchor}
        value={value}
        onChange={handleChange}
        autoFocus
        onKeyDown={onEnterPress}
      ></textarea>
    </form>
  );
}

function Command(props) {
  const anchor = useRef(null);

  useEffect(() => {
    anchor.current.scrollIntoView();
  });

  return (
    <div className="command">
      <span className="line-part1">root@user</span>
      <span className="line-part2">/dev/null$ </span>
      <span>{props.command}</span>
      <br />
      <div dangerouslySetInnerHTML={{ __html: props.response }} />
      <div ref={anchor} />
    </div>
  );
}
