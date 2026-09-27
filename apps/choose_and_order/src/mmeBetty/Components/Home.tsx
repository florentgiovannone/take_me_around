import HeroPage from "./Hero";
import About from "./About"
import Menus from "./Menus"
import BlackSeparator from "./BlackSeparator"
import GreySeparator from "./GreySeparator"
import Reservations from "./Reservations"
export default function Home() {
    return (
        <div>
            <HeroPage />
            <GreySeparator />
            <About />
            <BlackSeparator />
            <Menus />
            <GreySeparator />
            <Reservations />
            <BlackSeparator />
        </div>
    )
}