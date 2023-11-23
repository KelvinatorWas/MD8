import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

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
  createdAt:string;
};

type newIID = {
  name: string;
  species: string;
  sex: string;
  occupation: string;
  origin: string;
  pfp: string;
  birth_year: string;
  status: string;
  desc: string;
  createdAt:string;
};

const appendChildern = (parent:HTMLElement, ...children:HTMLElement[]) => {
  for (const child of children) {
    parent.appendChild(child);
  }
};

const createElement = (type = 'div', cssClass = '', jsonIdentifierClass = ''): HTMLElement => {
  const element = document.createElement(type);
  element.className = cssClass;
  if (jsonIdentifierClass.length) element.classList.add(jsonIdentifierClass);
  return element;
};

const createSpecialTextElement = (parent: HTMLElement, dataTypeText = '', text = 'Hello', keyID = '', id = 0) => {
  const textBoxElement = createElement('div', 'text-box');
  const typeForTextBoxElement = createElement('p', 'text-box__type');
  const textBoxTextElement = createElement('p', 'text-box__text');

  typeForTextBoxElement.textContent = dataTypeText;
  textBoxTextElement.textContent = text;
  textBoxTextElement.id = `${keyID}-${id}`;

  // Create an input element
  const inputElement = createElement('input', 'text-box__input') as HTMLInputElement;
  inputElement.value = text;

  inputElement.style.display = 'none';

  // Append all elements to the text box
  appendChildern(textBoxElement, typeForTextBoxElement, textBoxTextElement, inputElement);

  parent.appendChild(textBoxElement);

  inputElement.addEventListener('blur', () => {
    textBoxTextElement.textContent = inputElement.value;
    textBoxTextElement.style.display = 'block';
    inputElement.style.display = 'none';
  });

  inputElement.addEventListener('blur', async () => {
    const updatedValue = inputElement.value;

    try {
      await axios.patch(`http://localhost:3004/IID/${id}`, { [keyID]: updatedValue });
    } catch (error) {
      console.error('Error:', error);
    }

    textBoxTextElement.textContent = updatedValue;
    textBoxTextElement.style.display = 'block';
    inputElement.style.display = 'none';
  });
};

class IDCardManager {
  private idWrapper: HTMLElement | null;
  private centerWrapper: HTMLElement | null;

  constructor() {
    this.idWrapper = document.querySelector('.id-wrapper');
    this.centerWrapper = document.querySelector('.center-wrapper');
  }

  private createCardMainData(idCard: HTMLElement, data: IID): void {
    const mainDataWrapper = createElement(undefined, 'iid-card__main-data-wrapper');
    const pfp = createElement(undefined, 'iid-card___pfp');
    const dataRect = createElement('div', 'iid-main-data-wrapper__data-rect');
    const bottomCardDataRect = createElement('div', 'iid-card-data-rect');

    // Add Top Rect Data Text Elements

    createSpecialTextElement(dataRect, 'Name:', `${data.name}`, 'name', data.id);
    createSpecialTextElement(dataRect, 'Species:', `${data.species}`, 'species', data.id);
    createSpecialTextElement(dataRect, 'Sex:', `${data.sex}`, 'sex', data.id);
    createSpecialTextElement(dataRect, 'Origin:', `${data.origin}`, 'origin', data.id);

    // Add Bottom Rect Data Text Elements

    createSpecialTextElement(bottomCardDataRect, 'Occupation:', `${data.occupation}`, 'occupation', data.id);
    createSpecialTextElement(bottomCardDataRect, 'Birth Year:', `${data.birth_year} ${data.origin}'s Years`, 'species', data.id);
    createSpecialTextElement(bottomCardDataRect, 'Status:', `${data.status}`, 'status', data.id);

    const imageExtensions = ['png', 'jpg', 'jpeg'] as const;

    const fallBackImage = (index = 0) => {
      if (index >= imageExtensions.length) {
        pfp.style.background = 'url("./assets/images/default.png")';
        return;
      }

      const img = new Image();

      const imageSrc = `./assets/images/${data.pfp}.${imageExtensions[index]}`;
      img.src = imageSrc;

      img.onload = () => {
        pfp.style.background = `url("${imageSrc}")`;
        pfp.style.backgroundSize = '100%';
      };
      img.onerror = () => {
        fallBackImage(index + 1);
      };
    };

    fallBackImage();

    // Add the Data to the IdCard
    appendChildern(mainDataWrapper, pfp, dataRect);

    const createdAtElement = createElement('div', 'iid-card-created-at');
    const createdAtDate = new Date(data.createdAt);

    const dist = formatDistanceToNow(createdAtDate, { addSuffix: true });
    if (dist) createdAtElement.textContent = `Created At: ${dist}`;

    appendChildern(idCard, mainDataWrapper, bottomCardDataRect, createdAtElement);
  }

  private async fetchData(): Promise<IID[]> {
    try {
      const result = await axios.get<IID[]>('http://localhost:3004/IID');
      return result.data;
    } catch (error) {
      console.log('Error Fetching Data:', error);
      return [];
    }
  }

  private onIdCard(idCard: HTMLElement, id:IID) {
    let iidUdRect: HTMLElement | null = null;

    idCard.parentElement.addEventListener('mouseenter', () => {
      if (!iidUdRect) {
        const parent = idCard.parentElement;

        iidUdRect = createElement(undefined, 'iid-ud-rect');

        const deleteButton = createElement('button', 'delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
          try {
            await axios.delete(`http://localhost:3004/IID/${id.id}`);
            parent.remove();
          } catch (error) {
            console.error('Error:', error);
          }
        });

        const editButton = createElement('button', 'edit-button');
        editButton.textContent = 'Edit';

        let isEditMode = false;

        editButton.addEventListener('click', () => {
          isEditMode = !isEditMode;

          const textElements = idCard.querySelectorAll('.text-box__text');
          textElements.forEach((textElement:HTMLElement) => {
            const inputElement = textElement.nextElementSibling as HTMLInputElement;
            // eslint-disable-next-line no-param-reassign
            textElement.style.display = isEditMode ? 'none' : 'block';
            inputElement.style.display = isEditMode ? 'block' : 'none';
          });

          editButton.textContent = isEditMode ? 'Save' : 'Edit';
        });

        iidUdRect.appendChild(deleteButton);
        iidUdRect.appendChild(editButton);

        parent.appendChild(iidUdRect);
      }
    });

    idCard.parentElement.addEventListener('mouseleave', () => {
      if (iidUdRect && iidUdRect.parentElement) {
        iidUdRect.parentElement.removeChild(iidUdRect);
        iidUdRect = null;
      }
    });
  }

  private addEventListeners(): void {
    const submitButton = document.querySelector('.js-submit-button') as HTMLButtonElement | null;

    submitButton?.addEventListener('click', () => {
      this.addId();
    });
  }

  private addId(): void {
    // Get the form element
    const inputForm = document.getElementById('iidForm') as HTMLFormElement;

    const time = new Date().toISOString();

    const newId: IID = {
      id: 0,
      name: inputForm.namep.value,
      species: inputForm.species.value,
      sex: inputForm.sex.value,
      occupation: inputForm.occupation.value,
      origin: inputForm.origin.value,
      pfp: inputForm.pfp.value,
      birth_year: inputForm.birth_year.value,
      status: inputForm.status.value,
      desc: inputForm.desc.value,
      createdAt: time,
    };

    const data:newIID = { ...newId };
    axios.post('http://localhost:3004/IID', data).then((response) => {
      newId.id = response.data.id;
      // Create and append the new ID card
      const idCardBox = createElement(undefined, 'iid-card-box');
      const idCard = createElement(undefined, 'iid-card', 'js-card-wrapper');
      this.createCardMainData(idCard, newId);

      idCardBox.appendChild(idCard);
      if (this.idWrapper) {
        this.idWrapper.appendChild(idCardBox);
      }

      inputForm.reset();
      this.onIdCard(idCard, newId);
    });
  }

  async fetchAndDraw(): Promise<void> {
    const data = await this.fetchData();

    data.forEach((id) => {
      const idCardBox = createElement(undefined, 'iid-card-box');
      const idCard = createElement(undefined, 'iid-card', 'js-card-wrapper');

      this.createCardMainData(idCard, id);

      idCardBox.appendChild(idCard);

      if (this.idWrapper) {
        this.idWrapper.appendChild(idCardBox);
      }
      this.onIdCard(idCard, id);
    });
    this.addEventListeners();
  }
}

// Create an instance of the class
const idCardManager = new IDCardManager();

// Fetch data and render cards
idCardManager.fetchAndDraw();
