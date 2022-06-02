import '../css/Home.css';
import Screen from '../components/Screen';
import HomeIcons from '../components/HomeIcons'

export default function Home() {
  return (
    <Screen screenPath="home" title="Home">
      <div className="home-cards">
        {/*<HomeIcons permissions={permissions}  />*/}
      </div>
    </Screen>
  );
}
