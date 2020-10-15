window.addEventListener('DOMContentLoaded', () => {

    //* Init

    const abbrList = [],
        info = {},
        list = document.querySelector('.list__field ul');

    async function getInformationFromDB(url) {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }


    getInformationFromDB('http://localhost:3000/list')
        .then(data => {
            console.log(data);
            data.forEach(item => abbrList.push(item.name));
            console.log(abbrList);
            createListItems(abbrList, list);
            return data;
        })
        .then(data => {
            data.forEach((item) => {
                info[item.name] = new InfoCard(item.name, item.designation, item.designationRu, item.descriptionRu);
            });
            console.log(info);
        });


    class InfoCard {
        constructor(name, designation, designationRu, descriptionRu, parent) {
            this.name = name;
            this.designation = designation;
            this.designationRu = designationRu;
            this.descriptionRu = descriptionRu;
            this.parent = document.querySelector('.main__field');
            this.firstLetterUp();
        }


        firstLetterUp() {
            this.descriptionRu = this.descriptionRu[0].toUpperCase() + this.descriptionRu.slice(1);
        }


        render() {
            const content = document.createElement('div');

            content.classList.add('main__content');

            content.innerHTML = `
                <div class="main__header">${this.name}</div>
                <div class="main__title">${this.designation}</div>
                <div class="main__subtitle">(${this.designationRu})</div>
                <div class="main__descr">${this.descriptionRu}</div>
            `;

            this.parent.innerHTML = '';
            this.parent.append(content);
        }
    }

    //* List output

    function createListItems(array, list) {
        array.sort();

        array.forEach(i => {
            const listItem = document.createElement('li');

            listItem.classList.add('list__item');
            listItem.setAttribute('data-abbr', i);
            listItem.textContent = i;
            list.append(listItem);
        });
    }

    //*  Getting information.

    list.addEventListener('click', (e) => {
        if (e.target.classList.contains('list__item')) {
            showDescription(e.target.getAttribute('data-abbr'));
            setActeveClass(e.target, 'active');
        }
    });

    function showDescription(item) {
        for (let key in info) {
            if (key === item) {
                info[key].render();
            }
        }
    }

    function setActeveClass(element, activeClass) {
        const listItems = document.querySelectorAll('.list__field ul li');

        listItems.forEach((i) => {
            i.classList.remove(activeClass);
        });

        element.classList.add(activeClass);
    }

});