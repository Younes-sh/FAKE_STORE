import Head from "next/head"

export default function index() {
  return (
    <div className='container main'>
      <Head>
        <title>About</title>
        <meta name="description" content="About Fake store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <h1>Fake Store Authentication</h1>
        <br />
        <br />
        <br />
        <br />
        <p>This is a fake store authentication system made with Next.js and React.</p>
        <br />

        <a href="https://github.com/Younes-sh" target='_blank'>
          <img
            src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"
            alt="GitHub Repo"
          />
        </a>
        <br />
        <br />

        <a href="https://younessheikhlar.com/" target='_blank'>
          My personal website
        </a>
  
    </div>
  )
}
