import Vue from 'vue';
import Component from '../../src/elementui-demo-table/elementui-demo-table';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/fr';

Vue.use(ElementUI, { locale });

describe('elementui-demo-table.vue', () => {
  const Constructor = Vue.extend(Component);
  const propsData = {
    columns: [],
    items: []
  };

  it('should instance the right component', () => {
    const vm = new Constructor({propsData});
    expect(vm.$options.name).to.equal('elementui-demo-table');
  });

  it('should render correct content', () => {
    const vm = new Constructor({propsData}).$mount();
    expect(vm.$el.innerHTML).to.equal(propsData.text);
  });
});
