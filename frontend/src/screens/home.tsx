import FooterContent from "../components/footer"
import TopNavigation from "../navigations/topNavigation"

export default function HomeScreen() {
    return (
        <>
            <nav><TopNavigation/></nav>

            <main>
                Home Screen
            </main>

            <footer><FooterContent/></footer>
        </>
    )
}