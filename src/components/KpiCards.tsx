interface KpiCardProps {

    label: string;
    value: string | number;
}



export  function KpiCards({label , value} : KpiCardProps){

        return(

            <div className="bg-white border-2 border-gray-200 rounded-lg p-3 dark:bg-slate-900 dark:border-slate-700">
                    <div className="text-xs text-gray-500 dark:text-slate-400">
                            {label}
                    </div>
                    <div className="text-xl font-semibold mt-1">
                            {value}
                    </div>
            </div>
        )
}