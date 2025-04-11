import StatusButton from "@/app/dashboard/components/StatusButton";

export default function Controls() {
    return (
        <div className="flex items-center justify-between bg-white rounded-lg p-6">
            <div className="flex items-center gap-7">
                <p className="text-body text-dark-gray">Statut</p>
                <StatusButton status="En attente" />
            </div>
            <div className="flex items-center gap-7">
                <p className="text-body text-dark-gray">Actions</p>
                <button className="text-body text-dark-gray">Modifier</button>
                <button className="text-body text-dark-gray">Supprimer</button>
            </div>

        </div>
    )
}