
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang ='en'>
        <Head>
        <meta charSet="UTF-8"/>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0"/> */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/5.0.1/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="/static/css/styles.css"/>
        <link rel="stylesheet" href="//cdn.quilljs.com/1.2.6/quill.snow.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument