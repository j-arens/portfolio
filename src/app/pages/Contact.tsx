import { h, FunctionComponent } from 'preact';
import ContactForm from '../components/ContactForm';

const Contact: FunctionComponent<{}> = () => {
  return (
    <main role="main">
      <ContactForm />
    </main>
  );
};

export default Contact;
