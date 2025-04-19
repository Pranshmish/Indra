import '../index.css';

export default function Card () {
    return (
        <>
            <div className="flex flex-row mx-2 bg-amber-50">
                <div className='flex flex-col items-center border rounded-lg m-2 p-1'>
                    <div>Day</div>
                    <div><img className='w-5' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxBuT24LzHly7RNc3-464PLMntDFQlagfeDA&s" alt="" /></div>
                    <div>Temprature</div>
                </div>


                {/* copy of previous card */}
                <div className='flex flex-col items-center border rounded-lg m-2 p-1'>
                    <div>Day</div>
                    <div><img className='w-5' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxBuT24LzHly7RNc3-464PLMntDFQlagfeDA&s" alt="" /></div>
                    <div>Temprature</div>
                </div>
            </div>
        </>
    )
}