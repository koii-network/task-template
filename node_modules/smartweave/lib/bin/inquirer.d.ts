interface InquirerResult {
    payFeeForContractCreation: string;
}
export declare const askForContractCreationConfirmation: (randWord: string, expectedContractCreationFee: string) => Promise<InquirerResult>;
export {};
