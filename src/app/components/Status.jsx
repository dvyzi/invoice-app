export default function Status({ status }) {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'PAID':
                return {
                    textColor: 'text-green-1',
                    bgColor: 'bg-green-light',
                    dotColor: 'bg-green-1',
                    frenchLabel: 'Payée'
                };
            case 'PENDING':
                return {
                    textColor: 'text-orange-1',
                    bgColor: 'bg-orange-light',
                    dotColor: 'bg-orange-1',
                    frenchLabel: 'En attente'
                };
            case 'DRAFT':
                return {
                    textColor: 'text-dark-light',
                    bgColor: 'bg-gray-super-light',
                    dotColor: 'bg-dark-light',
                    frenchLabel: 'Brouillon'
                };
            default:
                return {
                    textColor: 'text-dark-2',
                    bgColor: 'bg-transparent',
                    dotColor: 'bg-transparent',
                    frenchLabel: status
                };
        }
    };

    const { textColor, bgColor, dotColor, frenchLabel } = getStatusConfig(status);

    return (
        <div className="text-heading-s-nobold text-dark-2 w-28">
            <span className={`${textColor} text-heading-s ${bgColor} rounded-md px-2 py-1 flex justify-center items-center`}>
                <div className={`${dotColor} rounded-full w-2 h-2 mr-2`}></div>
                {frenchLabel}
            </span>
        </div>
    );
} 