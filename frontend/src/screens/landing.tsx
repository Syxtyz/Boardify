import FooterContent from "../components/footer"
import TopNavigation from "../navigations/topNavigation"

export default function LandingScreen() {
    return (
        <>
            <nav className="fixed top-0 left-0 w-full"><TopNavigation/></nav>

            <main className="min-h-[calc(100vh-3rem)] p-4 mt-12 flex">
                <div className="bg-red-500">Landing Screen</div>
            </main>

            <footer><FooterContent/></footer>
        </>
    )
}