ci-crud
=======

Ready to go, easy to use CodeIgniter Model for basic CRUD operations on a table


### Installation

Drop the files into the appropriate directory (same as what is in the repo's directory structure)

### Usage

Load the model using 

```
$this->load->model('CRUD_model', 'crud');
```

Given this table (which is an example)

```
CREATE TABLE `users` (
    `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
    `first_name` varchar(255) NOT NULL DEFAULT '',
    `last_name` varchar(255) NOT NULL DEFAULT '',
    `phone` varchar(25) DEFAULT NULL,
    `email` varchar(255) DEFAULT NULL,
    `created_on` datetime NOT NULL,
    `mod_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```


To create your data.  Pass in an array, and use your table field names as the array keys.

```
$data['first_name'] = 'Steve';
$data['last_name'] 	= 'Jobs';
$data['last_name'] 	= '408-555-1212';
$data['email'] 		= 'norelpy@apple.com';

$this->crud->table('users')->create($data);
```

To update your data.  In the data you pass to the method, use your table field names as the array key.

```
// this will update user with id 1, changing last name to 'Ives'
$id = 1;
$data['last_name'] = 'Ives';

$this->crud->table('users')->create($id, $data);
```

To retrive your data.  Pass in the ID of the entry you want, or don't pass an id and it will return all records.

```
$id = 1;
$record = $this->crud->table('users')->get($id);

var_dump($record);
```