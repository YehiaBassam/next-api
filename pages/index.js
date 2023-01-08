import { Fragment } from 'react';
import Head from 'next/head';
import { MongoClient } from 'mongodb';
import MeetupList from '../components/meetups/MeetupList';

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name='description'
          content='Browse a huge list of highly active React meetups!'
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}

export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(
    'mongodb+srv://Yehia_Bassam:y12345678@cluster0.3qethlf.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find().toArray();
  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1, // time to re-excute this function ( option )

    // this function will return props to the component of page.
    // always runs on the server and never on the client after build the project.
    // runs before component rerender.
    // will be passed to the page component as props, 
    // always runs on the server and never on the client after build the project.
    // runs before component rerender.
    // used when you work with static case which not required to be re-excute ( like authentication ). 
    // this function will be cashed in cash.
    // can be used only in pages folder not in components.
    // https://www.reddit.com/r/nextjs/comments/piub3t/getstaticprops_or_useeffect_for_fetching_data/
  };
}
// both getStaticProps, getStaticPaths, getServerSideProps allow us to fetch data in pre-render the pages

// export async function getServerSideProps(context) { // server side rendring
//   const req = context.req;
//   const res = context.res;
//   return {
//     props: {
//       dummyData: Dummy_Data
//     },
//     // used when your data changes everytime like fetching api which changed with CRUD operations.
//     // will be passed to the page component as props.
//     // always runs on the server and never on the client.
//     // runs before component rerender.
//   }
// }

export default HomePage;
