import axios from 'axios';

// Type for all the data types in IDD database
type IID = {
  id: number;
  name: string;
  species: string;
  sex: string;
  occupation: string;
  origin: string;
  pfp: string;
  birth_year: string;
  status: string;
  desc: string;
};

const createElement = (type = 'div', cssClass = '', jsonIdentifierClass = ''): HTMLElement => {
  const element = document.createElement(type);
  element.className = cssClass;
  if (jsonIdentifierClass.length) element.classList.add(jsonIdentifierClass);
  return element;
};

const createTextElement = (parent:HTMLElement, type = 'div', cssClass = '', text = 'Hello') => {
  const textElement = createElement(type, cssClass);
  textElement.textContent = text;
  parent.appendChild(textElement);
};

class IDCardManager {
  private idWrapper: HTMLElement | null;

  constructor() {
    this.idWrapper = document.querySelector('.id-wrapper');
  }

  private createCardMainData(idCard: HTMLElement, data: IID): void {
    const mainDataWrapper = createElement(undefined, 'iid-card__main-data-wrapper');
    const pfp = createElement(undefined, 'iid-card___pfp');
    const dataRect = createElement('div', 'iid-main-data-wrapper__data-rect');
    const bottomCardDataRect = createElement('div', 'iid-card-data-rect');

    // Add Top Rect Data Text Elements

    createTextElement(dataRect, 'p', 'iid-main-data-wrapper__text', `Name: ${data.name}`);
    createTextElement(dataRect, 'p', 'iid-main-data-wrapper__text', `Species: ${data.species}`);
    createTextElement(dataRect, 'p', 'iid-main-data-wrapper__text', `Sex: ${data.sex}`);
    createTextElement(dataRect, 'p', 'iid-main-data-wrapper__text', `Origin: ${data.origin}`);

    // Add Bottom Rect Data Text Elements

    createTextElement(bottomCardDataRect, 'p', 'iid-main-data-wrapper__text', `Occupation: ${data.occupation}`);
    createTextElement(bottomCardDataRect, 'p', 'iid-main-data-wrapper__text', `Birth Year: ${data.birth_year} ${data.origin}'s Years`);
    createTextElement(bottomCardDataRect, 'p', 'iid-main-data-wrapper__text', `Satus: ${data.status}`);
    createTextElement(bottomCardDataRect, 'p', 'iid-main-data-wrapper__text', `Origin: ${data.origin}`);

    // Add the Data to the IdCard
    mainDataWrapper.appendChild(pfp);
    mainDataWrapper.appendChild(dataRect);

    idCard.appendChild(mainDataWrapper);
    idCard.appendChild(bottomCardDataRect);
  }

  fetchAndDraw(): void {
    const result = axios.get<IID[]>('http://localhost:3004/IID');

    result.then(({ data }) => {
      data.forEach((id) => {
        const idCard = createElement(undefined, 'iid-card', 'js-card-wrapper');

        this.createCardMainData(idCard, id);

        if (this.idWrapper) {
          this.idWrapper.appendChild(idCard);
        }
      });
    });
  }
}

// Create an instance of the class
const idCardManager = new IDCardManager();

// Fetch data and render cards
idCardManager.fetchAndDraw();
