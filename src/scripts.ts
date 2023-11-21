import axios from 'axios';

const idWrapper = document.querySelector('.id-wrapper');

// create a basic Element
const createElement = (type = 'div', cssClass = '', jsonIdentifierClass = ''):HTMLElement => {
  const element = document.createElement(type);
  element.className = cssClass;
  if (jsonIdentifierClass.length) element.classList.add(jsonIdentifierClass);
  return element;
};

// Type for all the data types in IDD database
type IID = {
    id: number,
    name: string,
    species: string,
    sex: string,
    occupation: string,
    origin: string,
    pfp: string,
    birth_year: string,
    alive: boolean,
    desc: string,
}

const result = axios.get<IID[]>('http://localhost:3004/IID');

let IIDs:IID[] = [];

result.then(({ data }) => {
  data.forEach((id) => {
    const idCard = createElement(undefined, 'iid-card', 'iid-card-wrapper');
    idWrapper.appendChild(idCard);
  });
});
