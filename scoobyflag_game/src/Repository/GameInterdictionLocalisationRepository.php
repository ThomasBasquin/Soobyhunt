<?php

namespace App\Repository;

use App\Entity\GameInterdictionLocalisation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<GameInterdictionLocalisation>
 *
 * @method GameInterdictionLocalisation|null find($id, $lockMode = null, $lockVersion = null)
 * @method GameInterdictionLocalisation|null findOneBy(array $criteria, array $orderBy = null)
 * @method GameInterdictionLocalisation[]    findAll()
 * @method GameInterdictionLocalisation[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GameInterdictionLocalisationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GameInterdictionLocalisation::class);
    }

    public function save(GameInterdictionLocalisation $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(GameInterdictionLocalisation $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

//    /**
//     * @return GameInterdictionLocalisation[] Returns an array of GameInterdictionLocalisation objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('g')
//            ->andWhere('g.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('g.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?GameInterdictionLocalisation
//    {
//        return $this->createQueryBuilder('g')
//            ->andWhere('g.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
