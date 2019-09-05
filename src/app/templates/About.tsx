import { h } from 'preact';

console.log('ABOUT LOADED');

const About = () => {
  return (
    <div>lol about</div>
  );
};

if (!('APP' in self)) {
  // @ts-ignore
  self.APP = {};
}

// @ts-ignore
if (!('components' in self.APP)) {
  // @ts-ignore
  self.APP.components = {};
}

// @ts-ignore
self.APP.components.About = About;

export default About;
