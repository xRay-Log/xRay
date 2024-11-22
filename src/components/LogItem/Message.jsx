import React, { useEffect, useRef, memo } from 'react';

const styles = `
  :host {
    display: block;
    width: 100%;
  }
  .content {
    margin: 0;
    padding-top: 2em;
    overflow: auto;
    background-color: transparent;
  }
`;

const Message = ({ data }) => {  
  const containerRef = useRef(null);
  const hostRef = useRef(null);

  useEffect(() => {
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

  return <div ref={containerRef} />;
};

export default memo(Message);