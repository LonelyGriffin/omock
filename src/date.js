const Global = global || window || this;
const ORIGINAL_DATE = Global.Date;

const DateMockHelper = {
	OriginalDate: ORIGINAL_DATE,
	mockConstructor: (instance) => {
		Global.Date = class extends ORIGINAL_DATE {
			constructor() {
				super();
				return instance;
			}
		};
	},
	unmock: () => {
		Global.Date = ORIGINAL_DATE;
	},
};

export default DateMockHelper;
