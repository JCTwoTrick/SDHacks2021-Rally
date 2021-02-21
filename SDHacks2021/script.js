class AppForm {
  constructor() {
    this.form = [];
    this.step = 0;
    this.currentGroup = null;

    this.setListeners();
    this.getForm();
    document.getElementById('next-button').disabled = true;
    this.refresh();
    this.check();
  }

  submit = () => {
    const ev = document.getElementById('event-input').value;
    const des = document.getElementById('description-input').value;
    const loc = document.getElementById('location-input').value;
    const day = document.getElementById('date-input').value;
    const time = document.getElementById('time-input').value;
    const img = document.getElementById('image-input').value;

    var data = {
      name: ev,
      description: des,
      location: loc,
      date: day,
      time: time,
      image: img
    }
    firebase.database().ref('Event').push(data).then(res => {
      window.location.href = 'main.html'
    });

  }

  currentInput = () => this.form[this.step - 1].input;
  previousInput = () => this.form[this.step - 2].input;

  check = () => this.currentInput().addEventListener('keyup', () => this.enableDisable());

  enableDisable = () => {
    if (this.valid(this.currentInput())) {
      this.currentInput().classList.remove('invalid');
      this.setListeners();
      document.getElementById('next-button').disabled = false;
    } else {
      this.currentInput().classList.add('invalid');
      this.removeListeners();
      document.getElementById('next-button').disabled = true;
    }
  }

  valid = (input) => {
    const formType = input.id;
    const value = input.value;
    const empty = (str) => !str.split('').every(_char => _char !== ' ');
    if (!value || empty(value)) return false;
    switch (formType) {
      case 'event-input':
        return /\S+/.test(value);
      case 'description-input':
        return /\S+/.test(value);
      case 'location-input':
        return /\S+/.test(value);
      case 'date-input':
        return /\S+/.test(value);
      case 'time-input':
        return /\S+/.test(value);
      case 'image-input':
        return true;
      default:
        return true;
    }
  };

  goBack = () => {
    if (this.step > 1) {
      this.currentInput().value = '';
      this.step--;
      this.displayStep();
      this.enableDisable();
    }
  }

  refresh = () => {
    this.step++;
    if (this.step <= this.form.length) {
      this.displayStep();
      if (this.step < this.form.length) {
        this.removeListeners();
        document.getElementById('next-button').disabled = true;
      }
      this.check();
    } else
      this.submit();
  }

  displayStep = () => {
    if (this.currentGroup)
      this.currentGroup.style.display = 'none';
    this.currentGroup = this.form.find(_group => _group.step === this.step).element;
    this.currentGroup.style.display = 'block';
  }

  getForm = () => {
    const groups = Array.from(document.getElementsByClassName('form-group'));
    groups.forEach(_group => {
      const children = Array.from(_group.children);
      this.form.push({
        'step': Number.parseInt(_group.dataset.step),
        'element': _group,
        'input': children.find(_el => _el.nodeName === 'INPUT')
      });
    });
  }

  setListeners = () => {
    document.getElementById('next-button').addEventListener('click', this.refresh);
    document.getElementById('back-button').addEventListener('click', this.goBack);
  }

  removeListeners = () => {
    document.getElementById('next-button').removeEventListener('click', this.refresh);
  }
}

new AppForm();
