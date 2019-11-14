import { h, FunctionComponent } from 'preact';
// const headshot = require('~assets/headshot.jpg');
const s = require('./style.pcss');

const Bio: FunctionComponent<{}> = () => {
  return (
    <section class={s.container}>
      <figure class={s.headshot}>
        {/* <img class={s.headshotImg} src={headshot} alt="some doofus" /> */}
      </figure>
      <article class={s.cv}>
        <p class={s.cvText}>
          I am a full stack developer with experience in multiple languages
          including JavaScript/Typescript/Node, PHP, Rust, and Go. I focus
          mainly on web technologies and am proficient on the frontend and
          backend. I have experience deploying and maintaining large
          applications and containerized services using modern cloud solutions
          on AWS and GCP with CI/CD pipelines.
        </p>
      </article>
    </section>
  );
};

export default Bio;
