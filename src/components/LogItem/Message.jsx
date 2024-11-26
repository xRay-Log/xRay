import React, { useEffect, useRef, memo } from 'react';
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css'

const styles = `
  :host {
    display: block;
    width: 100%;
  }
  .content {
    margin: 0;
    overflow: auto;
    background-color: transparent;
  }
`;

const isJSON = (str) => {
  try {
    const result = JSON.parse(str);
    return typeof result === 'object';
  } catch (e) {
    return false;
  }
};

const Message = ({ data }) => {  
  const containerRef = useRef(null);
  const hostRef = useRef(null);

  useEffect(() => {
    if (isJSON(data)) {
      return;
    }

    if (!containerRef.current) return;

    const host = document.createElement('div');
    hostRef.current = host;
    const shadow = host.attachShadow({ mode: 'open' });
    
    const style = document.createElement('style');
    style.textContent = styles;

    const content = document.createElement('div');
    content.className = 'content';
    content.innerHTML = data;

    shadow.append(style, content);
    containerRef.current.appendChild(host);

    return () => {
      hostRef.current?.remove();
    };
  }, [data]);

  if (isJSON(data)) {
    return (
      <>
        <JsonView
          src={JSON.parse(data)}
          theme="default"
          displayObjectSize={false}
          displayDataTypes={false}
          enableClipboard={false}
          collapseStringsAfterLength={80}
        />
      </>
    );
  }

  return <div ref={containerRef} />;
};

export default memo(Message);