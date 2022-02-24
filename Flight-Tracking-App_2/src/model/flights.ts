export interface JsonResponse {
	flights: Flights[] | undefined;
}

export interface Flights {
	time: number;
	states: any[];
}
