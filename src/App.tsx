import './index.css';
import Card from "./components/Card.tsx";

function App() {

    return (
        <div className="w-full min-h-screen bg-gradient">

            <div className="p-20">
            <header>
                <h1 className="text-2xl font-bold mb-6 text-center">따뜻한 하루를 시작해요!</h1>
            </header>


            <main className="grid grid-cols-2 grid-rows-min gap-6 h-full max-w-4xl mx-auto px-4 py-10">
                <Card title="추천 활동" className="col-start-1 row-start-1">
                    컴포넌트 추가
                </Card>

                <Card title="달력"
                      className="col-start-2 row-start-1 row-span-2">
                    컴포넌트 추가
                </Card>

                <Card title="데이터" className="col-start-1 row-start-2">
                    컴포넌트 추가
                </Card>
            </main>
            </div>

            <footer className="bg-black text-white p-6 text-center text-sm">
                &copy; Baeju0
            </footer>
        </div>
    );
}

export default App;