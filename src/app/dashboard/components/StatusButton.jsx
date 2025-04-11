export default function StatusButton({ status }) {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Payée':
                return {
                    textColor: 'text-green-1',
                    bgColor: 'bg-green-light',
                    dotColor: 'bg-green-1'
                };
            case 'En attente':
                return {
                    textColor: 'text-orange-1',
                    bgColor: 'bg-orange-light',
                    dotColor: 'bg-orange-1'
                };
            case 'Brouillon':
                return {
                    textColor: 'text-dark-light',
                    bgColor: 'bg-gray-super-light',
                    dotColor: 'bg-dark-light'
                };
            default:
                return {
                    textColor: 'text-dark-2',
                    bgColor: 'bg-transparent',
                    dotColor: 'bg-transparent'
                };
        }
    };

    const { textColor, bgColor, dotColor } = getStatusConfig(status);

    return (
        <button className="text-heading-s-nobold text-dark-2 w-28">
            <span className={`${textColor} text-heading-s ${bgColor} rounded-md px-2 py-1 flex justify-center items-center`}>
                <div className={`${dotColor} rounded-full w-2 h-2 mr-2`}></div>
                {status}
            </span>
        </button>
    );
} 