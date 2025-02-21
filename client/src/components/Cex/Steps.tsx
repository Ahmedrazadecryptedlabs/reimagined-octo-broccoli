interface StepProps {
    step: number;
    title: string;
    description: string;
}

const Step = ({ step, title, description }: StepProps) => (
    <li className="flex gap-3 items-start">
        <div className="flex items-center justify-center mt-1 w-5 h-5 text-xxs font-bold text-cyan-400 bg-[#1A2B3E] rounded-full border border-cyan-400">
            {step}
        </div>
        <div className="flex-1">
            <h3 className="text-white leading-5 text-sm">{title}</h3>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    </li>
);

const Steps = () => {
    const steps = [
        { step: 1, title: "Login to your CEX account", description: "Login and ensure you have the asset you want to transfer." },
        { step: 2, title: "Select 'Withdraw'", description: "Click on the 'Withdraw' button next to your chosen asset." },
        { step: 3, title: "Enter your Solana wallet address", description: "Ensure that you have already installed a Solana wallet. Paste your unique Solana wallet address in the 'Recipient's SOL Address' field." },
        { step: 4, title: "Choose the Network", description: "Select the Solana network (SOL) for the transfer." },
        { step: 5, title: "Enter the amount", description: "Input the amount of the cryptocurrency you wish to transfer. There is usually a minimum transfer amount and a withdrawal fee." },
        { step: 6, title: "Verify details", description: "Ensure all details are correct. Verify your wallet address and that you're using the Solana network. If the wrong address is used, you won't be able to recover your assets." },
        { step: 7, title: "Confirm the withdrawal", description: "Click on 'Withdraw' to initiate the transfer." },
        { step: 8, title: "Await confirmation", description: "Wait for the CEX to process the transaction, which might take a few minutes." },
        { step: 9, title: "Check that assets arrived", description: "Open your Solana wallet and check that your assets have arrived." },
    ];

    return (
        <ul className="space-y-4">
            {steps.map((step) => (
                <Step key={step.step} {...step} />
            ))}
        </ul>
    );
};

export const StepsBox = () => (
    <div className="bg-v2-background-dark rounded-2xl shadow-2xl p-6 w-full max-w-[600px]">
        <h2 className="text-lg text-white font-semibold mb-4">How to bridge assets into Solana from a CEX</h2>
        <Steps />
    </div>
);