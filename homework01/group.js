var group = [
    { name: '심다은', age: 23, address: '광명'},
    { name: '김동관', age: 26, address: '부천'},
    { name: '유태혁', age: 20, address: '천안'},
    { name: '조충범', age: 25, address: '과천'},
    { name: '최해랑', age: 27, address: '광명'}
]

console.log('<< 저희 조는 4조입니다! >>')
group.forEach(
    people => console.log('이름은 ' + people.name +'이고, 나이는 ' + people.age + '이고, 사는 곳은 ' + people.address +'입니다.')
    );
