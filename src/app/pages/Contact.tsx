import { h, FunctionComponent } from 'preact';
import ContactForm from '../components/ContactForm';
require('./style.pcss');

const Contact: FunctionComponent<{}> = () => {
  return (
    <main class="has-dynamic-styles" role="main">
      <ContactForm />
    </main>
  );
};

export default Contact;
