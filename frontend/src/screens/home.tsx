import FooterContent from "../components/footer"
import TopNavigation from "../navigations/topNavigation"

export default function HomeScreen() {
    return (
        <>
            <div className="h-screen">
                <nav><TopNavigation/></nav>

                <main className="p-4">
                    Home Screen
                </main>
            </div>

            <footer><FooterContent/></footer>
        </>
    )
}