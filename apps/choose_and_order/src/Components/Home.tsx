import HeroPage from "./Hero";
import About from "./About"
import Menus from "./Menus"
import BlackSeparator from "./BlackSeparator"
import GreySeparator from "./GreySeparator"
import Contact from "./Contact"
export default function Home() {
    return (
        <div>
            <HeroPage />
            <BlackSeparator />
            <About />
            <GreySeparator />
            <Menus />
            <BlackSeparator />
            <Contact />
            <GreySeparator />
        </div>
    )
}