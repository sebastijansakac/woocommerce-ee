<?php
/**
 * Shop System Plugins:
 * - Terms of Use can be found under:
 * https://github.com/wirecard/woocommerce-ee/blob/master/_TERMS_OF_USE
 * - License can be found under:
 * https://github.com/wirecard/woocommerce-ee/blob/master/LICENSE
 */
namespace Helper;
//namespace Codeception\Module;
use Codeception\Exception\ModuleException;
/**
 * Additional methods for DB module
 */
class DbHelper extends \Codeception\Module
{
	/**
	 * Method getColumnFromDatabaseNoCriteria
	 * @param string $table
	 * @param string $column
	 * @return array
	 *
	 * @throws ModuleException
	 * @since 2.0.3
	 */
	public function getColumnFromDatabaseNoCriteria($table, $column)
	{
		$dbh = $this->getModule('Db')->dbh;
		$query = "select %s from %s";
		$query = sprintf($query, $column, $table);
		$this->debugSection('Query', $query);
		$sth = $dbh->prepare($query);
		$sth->execute();
		return $sth->fetchAll(\PDO::FETCH_COLUMN, 0);
	}
}
