const iolModels = [
  {id:'puresee',name:'TECNIS PureSee'},
  {id:'odyssey',name:'TECNIS Odyssey'},
  {id:'eyhance',name:'TECNIS Eyhance'},
  {id:'toric2',name:'TECNIS Toric II'}
];

function demoInventory(){return {
  iol:[
    {model:'puresee',power:'+18.0 D',cylinder:'',qty:4},
    {model:'puresee',power:'+20.0 D',cylinder:'',qty:2},
    {model:'puresee',power:'+22.0 D',cylinder:'',qty:0},
    {model:'odyssey',power:'+18.0 D',cylinder:'',qty:3},
    {model:'odyssey',power:'+20.0 D',cylinder:'',qty:5},
    {model:'odyssey',power:'+22.0 D',cylinder:'',qty:1},
    {model:'eyhance',power:'+18.0 D',cylinder:'',qty:6},
    {model:'eyhance',power:'+20.0 D',cylinder:'',qty:8},
    {model:'eyhance',power:'+22.0 D',cylinder:'',qty:4},
    {model:'toric2',power:'+18.0 D',cylinder:'散光 +1.50 D',qty:2},
    {model:'toric2',power:'+20.0 D',cylinder:'散光 +1.50 D',qty:1},
    {model:'toric2',power:'+20.0 D',cylinder:'散光 +2.25 D',qty:0},
    {model:'toric2',power:'+22.0 D',cylinder:'散光 +2.25 D',qty:2}
  ],
  consumables:[
    {system:'Catalys',name:'LOI 液态光学接口',qty:12,unit:'套'},
    {system:'VERITAS',name:'超乳管路耗材（演示类别）',qty:18,unit:'套'}
  ]
}}

function findIolStock(inventory,model,power,cylinder=''){
  return inventory.iol.find(item=>item.model===model&&item.power===power&&item.cylinder===cylinder)||null;
}
