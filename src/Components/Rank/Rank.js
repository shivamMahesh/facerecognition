import React from 'react';

const Rank=({name , enteries})=>
{
	//console.log(name,enteries);
return(
	<div>
	<div className='white f3'>
	{name} {' YOUR CURRENT UPLOAD COUNT  IS....'}
	</div>
	<div className='white f1'>
	# {enteries}
	</div>
	</div>
	);
}

export default Rank;