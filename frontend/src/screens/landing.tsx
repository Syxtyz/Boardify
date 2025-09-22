import FooterContent from "../components/footer"
import TopNavigation from "../navigations/topNavigation"

export default function LandingScreen() {
    return (
        <>
            <nav className="fixed top-0 left-0 w-full"><TopNavigation/></nav>

            <main className="h-screen p-4 mt-12">
                Landing Screen
            </main>

            <footer><FooterContent/></footer>
        </>
    )
}